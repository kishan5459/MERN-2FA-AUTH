import { connect } from "mongoose"

export const dbConnect = async () => {
  try {
    const mongoDbConnection = await connect(process.env.MONGODB_URI, {
      dbName: process.env.DB_NAME
    })
    console.log(`Database connected : ${mongoDbConnection.connection.host }`)
  } catch (error) {
    console.log(`Database Error : ${error}`)
  }
}