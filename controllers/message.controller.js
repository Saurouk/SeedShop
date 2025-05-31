const db = require('../models');
const Message = db.Message;
const User = db.User;

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
