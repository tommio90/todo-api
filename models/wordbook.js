module.exports = function(sequelize, DataTypes) {
	return sequelize.define('wordzh', {
		
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
		}
		
	});
};