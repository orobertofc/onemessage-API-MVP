const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const user_to_db = require("./user_info_to_db");

async function main(user_name) {
  // Generate IDs
  let private_id = uuidv4();
  let public_id = uuidv4();

  // Hash the private ID
  const saltRounds = 10;
  let private_id_hashed = bcrypt.hashSync(private_id, saltRounds);

  // Send the user to the database
  if (await user_to_db(user_name, public_id, private_id_hashed)) {
    return [private_id_hashed, public_id];
  } else {
    console.error("There was an error while sending the user to the database.");
    return "There was an error while sending the user to the database.";
  }
}

module.exports = main;
