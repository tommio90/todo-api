module.exports = function(sequelize, DataTypes) {
	return sequelize.define('word_test', {
			
	
		
		spelling: {
			type: DataTypes.STRING,
			allowNull: true,
			validate: {
				len: [1, 21]
			}
		},
        translation: {
			type: DataTypes.STRING,
			allowNull: true,
			validate: {
				len: [1, 600]
			}
		},
	    length: {
			type: DataTypes.STRING,
			allowNull: true,
			validate: {
				len: [1, 600]
			}
			
		},
        hsk: {
			type: DataTypes.INTEGER,
			allowNull: true,
			
		},
		
		pinyin_tone: {
			type: DataTypes.STRING,
			allowNull: true,
			validate: {
				len: [1, 40]
			}
		},
        pinyin: {
			type: DataTypes.INTEGER,
			allowNull: true,
			
		},


        pinyin_input: {
			type: DataTypes.STRING,
			allowNull: true,
			validate: {
				len: [1, 40]
			}
		},

        Wmillion: {
			type: DataTypes.STRING,
			allowNull: true,
			validate: {
				len: [1, 40]
			}
		},
        dominant_pos: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [1, 2]
			}
		}
		
	});
};