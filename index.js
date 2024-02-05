const {
  getUser,
  getAllsUser,
  createUser,
  updateUser,
  deleteUser,
} = require("./model/userModel.js");

exports.handler = async (event) => {
  console.log("Received event:", JSON.stringify(event, null, 2));
  try {
    if (event.function === "getAll") {
      return await this.getAllsUserHandler(event);
    } else if (event.function === "create") {
      return await this.createUserHandler(event);
    } else if (event.function == "update") {
      return await this.updateUserHandler(event);
    } else if (event.function == "delete") {
      return await this.deleteUserHandler(event);
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Unsupported HTTP method",evento: event }),
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

exports.createUserHandler = async (event) => {
  console.log("Event: ", event);
  try {
    await createUser(event.body);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "User create successfully" }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};


exports.getUserHandler = async (event) => {
  try {
    const data = JSON.parse(event.body);
    const user = await getUser(data);
    return {
      statusCode: 200,
      body: JSON.stringify({ user }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
exports.getAllsUserHandler = async (event) => {
  try {
    const user = await getAllsUser();
    return {
      statusCode: 200,
      body: JSON.stringify({ user }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
exports.deleteUserHandler = async (event) => {
  try {
    const data = JSON.parse(event.body);
    await deleteUser(data);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "User deleted successfully" }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
exports.updateUserHandler = async (event) => {
  try {
    const data = JSON.parse(event.body);
    await updateUser(data);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "User update successfully" }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
