import { DataTypes } from 'sequelize'
import sequelize from '../database/database.js'

const User = sequelize.define('user', {
    id: { 
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: { type: DataTypes.STRING,  allowNull: false  },
    email: { type: DataTypes.STRING,  allowNull: true  },
    password: { type: DataTypes.STRING , allowNull: false }
})


sequelize.sync({
    force: false
})

export default User
