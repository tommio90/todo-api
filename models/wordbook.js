module.exports = function(sequelize, DataTypes) {
	return sequelize.define('wordbook', {
		
			chapter: {
			type: DataTypes.INTEGER,
			allowNull: true,
			
		},

		hanzi: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [1, 25]
			}
		},

		pinyin: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [1, 25]
			}
			
		},

		translation: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [1, 25]
			}
			
		}
		
	});
};