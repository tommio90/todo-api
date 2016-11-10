module.exports = function(sequelize, DataTypes) {
	return sequelize.define('wordbook', {
		
		hsk: {
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

		meaning: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [1, 600]
			}
			
		}
		
	});
};