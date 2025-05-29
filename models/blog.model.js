// models/blog.model.js

module.exports = (sequelize, DataTypes) => {
  const Blog = sequelize.define('Blog', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    published: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  }, {
    tableName: 'blogs',
    timestamps: true,
  });

  // Association avec User (auteur de l’article)
  Blog.associate = (models) => {
    Blog.belongsTo(models.User, {
      foreignKey: {
        name: 'authorId',
        allowNull: false,
      },
      as: 'author',
    });
  };

  return Blog;
};
