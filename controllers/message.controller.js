const db = require('../models');
const Message = db.Message;
const User = db.User;
const { sendEmail } = require('../services/email.service');

// 🔸 Envoyer un message (admin ou user)
exports.sendMessage = async (req, res) => {
  const senderId = req.user.id;
  const {
    receiverId,
    receiverEmail,
    subject,
    reason,
    description,
    content,
    attachmentUrl
  } = req.body;

  try {
    let receiver = null;

    if (receiverId) {
      receiver = await User.findByPk(receiverId);
    } else if (receiverEmail) {
      receiver = await User.findOne({ where: { email: receiverEmail } });
    } else {
      receiver = await User.findOne({ where: { role: 'admin' } });
    }

    if (!receiver) {
      return res.status(404).json({ message: "Destinataire introuvable." });
    }

    const finalSubject = reason || subject || "Message sans sujet";
    const finalContent = description || content || "Pas de contenu fourni";

    const message = await Message.create({
      senderId,
      receiverId: receiver.id,
      subject: finalSubject,
      content: finalContent,
      attachmentUrl
    });

    const sender = await User.findByPk(senderId);
    if (sender && sender.email) {
      await sendEmail(
        sender.email,
        "Confirmation de réception de votre message",
        `<p>Bonjour ${sender.username},</p>
         <p>Nous avons bien reçu votre message concernant : <strong>${finalSubject}</strong>.</p>
         <p>Nous vous répondrons dans les plus brefs délais.</p>
         <p>— L'équipe SeedShop</p>`
      );
    }

    res.status(201).json({ message: "Message envoyé avec succès.", message });
  } catch (error) {
    console.error("Erreur envoi message :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

// 🔸 Récupérer la boîte de réception (messages reçus)
exports.getInbox = async (req, res) => {
  const userId = req.user.id;

  try {
    const filter = { receiverId: userId };

    if (req.query.read === 'false') {
      filter.read = false;
    }

    const messages = await Message.findAll({
      where: filter,
      include: [{ model: User, as: 'sender', attributes: ['id', 'username', 'email'] }],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Erreur récupération inbox :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

// 🔸 Marquer un message comme lu
exports.markAsRead = async (req, res) => {
  const messageId = req.params.id;
  const userId = req.user.id;

  try {
    const message = await Message.findOne({
      where: { id: messageId, receiverId: userId }
    });

    if (!message) {
      return res.status(404).json({ message: "Message introuvable ou accès refusé." });
    }

    message.read = true;
    await message.save();

    res.status(200).json({ message: "Message marqué comme lu." });
  } catch (error) {
    console.error("Erreur mise à jour lecture :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

// 🔸 Répondre à un message existant
exports.replyToMessage = async (req, res) => {
  const senderId = req.user.id;
  const originalMessageId = req.params.id;
  const { subject, content, attachmentUrl } = req.body;

  try {
    const originalMessage = await Message.findByPk(originalMessageId);

    if (!originalMessage) {
      return res.status(404).json({ message: "Message original introuvable." });
    }

    const newMessage = await Message.create({
      senderId,
      receiverId: originalMessage.senderId || null,
      subject: subject || `Re: ${originalMessage.subject}`,
      content,
      attachmentUrl
    });

    // 🔔 Notification email pour user ou visiteur
    if (originalMessage.visitorEmail) {
      await sendEmail(
        originalMessage.visitorEmail,
        subject || `Re: ${originalMessage.subject}`,
        `<p>Bonjour ${originalMessage.visitorName || 'visiteur'},</p>
         <p>Nous avons répondu à votre message : <strong>${originalMessage.subject}</strong>.</p>
         <blockquote>${content}</blockquote>
         <p>— L'équipe SeedShop</p>`
      );
    } else if (originalMessage.senderId) {
      const receiver = await User.findByPk(originalMessage.senderId);
      if (receiver?.email) {
        await sendEmail(
          receiver.email,
          newMessage.subject,
          `<p>Bonjour ${receiver.username},</p>
           <p>Vous avez reçu une réponse à votre message : <strong>${originalMessage.subject}</strong>.</p>
           <blockquote>${content}</blockquote>
           <p>— L'équipe SeedShop</p>`
        );
      }
    }

    res.status(201).json({ message: "Réponse envoyée avec succès.", message: newMessage });
  } catch (error) {
    console.error("Erreur lors de la réponse au message :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

// 🔸 Récupérer un message par ID + marquage comme lu
exports.getMessageById = async (req, res) => {
  const messageId = req.params.id;
  const userId = req.user.id;

  try {
    const message = await Message.findOne({
      where: { id: messageId, receiverId: userId },
      include: [{ model: User, as: 'sender', attributes: ['id', 'username', 'email'] }]
    });

    if (!message) {
      return res.status(404).json({ message: "Message introuvable ou accès refusé." });
    }

    if (!message.read) {
      message.read = true;
      await message.save();
    }

    res.status(200).json(message);
  } catch (error) {
    console.error("Erreur récupération message :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

// 🔸 Envoyer un message via le formulaire de contact (visiteur)
exports.sendContactMessage = async (req, res) => {
  const { email, username, subject, reason, description } = req.body;

  try {
    if (!email || !username || !reason || !description) {
      return res.status(400).json({ message: "Tous les champs sont requis." });
    }

    const admin = await User.findOne({ where: { role: 'admin' } });

    if (!admin) {
      return res.status(500).json({ message: "Aucun administrateur trouvé." });
    }

    const message = await Message.create({
      senderId: null,
      receiverId: admin.id,
      subject: reason || subject,
      content: description,
      visitorName: username,
      visitorEmail: email
    });

    await sendEmail(
      email,
      "Confirmation de votre demande de contact",
      `<p>Bonjour ${username},</p>
       <p>Nous avons bien reçu votre message concernant : <strong>${reason}</strong>.</p>
       <p>Un administrateur vous répondra prochainement.</p>
       <p>— L'équipe SeedShop</p>`
    );

    res.status(201).json({ message: "Message envoyé avec succès." });
  } catch (error) {
    console.error("Erreur envoi message contact :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};
