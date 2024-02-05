const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  ScanCommand,
  PutCommand,
  GetCommand,
  DeleteCommand,
} = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({});
const DynamoDB = DynamoDBDocumentClient.from(client);

class UserModel {
  static TABLE_NAME = "Users";
  static PRIMARY_KEY = "PK";
  static SORT_KEY = "SK";
  static async createUser(data) {
    try {
      const existingUser = await this.getUser(data.user);
      if (existingUser.success) {
        throw new Error("The user already registered");
      }

      await DynamoDB.send(
        new PutCommand({
          TableName: this.TABLE_NAME,
          Item: {
            [this.PRIMARY_KEY]: data.user,
            [this.SORT_KEY]: data.fullname,
            fullname: data.fullname,
            email: data.email,
            password: data.password,
            date: Date.now(),
          },
        })
      );

      return { success: true, message: "User registered successfully" };
    } catch (error) {
      return {
        success: false,
        message: "Cannot create user",
        error: error.message,
      };
    }
  }

  static async getUser(data) {
    try {
      const result = await DynamoDB.send(
        new GetCommand({
          TableName: "Users",
          Key: { PK: data.user },
        })
      );
      if (!result.Item) {
        return { success: false, message: "User not found" };
      }
      return {
        success: true,
        allData: result.Item,
      };
    } catch (error) {
      return {
        success: false,
        message: "Cannot get the user",
        errorMessage: error.message,
      };
    }
  }

  static async getAllsUser() {
    try {
      const result = await DynamoDB.send(
        new ScanCommand({
          TableName: "Users",
        })
      );
      const data = result.Items;
      return {
        success: true,
        alldata: data,
      };
    } catch (error) {
      return {
        success: false,
        message: "Cannot get the users",
        errorMessage: error.message,
      };
    }
  }

  static async deleteUser(data) {
    try {
      const result = await DynamoDB.send(
        new DeleteCommand({
          TableName: "Users",
          Key: {
            PK: data.user,
            SK: data.fullname,
          },
        })
      );
      return {
        success: true,
        message: "User deleted successfully",
        deletedData: result,
      };
    } catch (error) {
      return { success: false, message: "Cannot delete user", error };
    }
  }

  static async updateUser(data) {
    try {
      const result = await DynamoDB.send(
        new UpdateCommand({
          TableName: "Users",
          Key: {
            PK: data.user,
            SK: data.fullname,
          },
          UpdateExpression:
            "SET #attr1 = :fullname, #attr2 = :email, #attr3 = :password, #attr4 = :date",
          ExpressionAttributeNames: {
            "#attr1": "fullname",
            "#attr2": "email",
            "#attr3": "password",
            "#attr4": "date",
          },
          ExpressionAttributeValues: {
            ":value1": data.fullname,
            ":value2": data.email,
            ":value3": data.password,
            ":value4": Date.now(),
          },
          ReturnValues: "ALL_NEW",
        })
      );
      return {
        success: true,
        message: "Update made successfully",
        UpdatedData: result.Attributes,
      };
    } catch (error) {
      return { success: false, message: "Cannot update user", error };
    }
  }
}

module.exports = UserModel;
