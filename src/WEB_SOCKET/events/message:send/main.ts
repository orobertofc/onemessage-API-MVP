import pg, { QueryResult } from "pg";

const connectionString: string = process.env.POSTGRES_URL;
const ssl: boolean = process.env.POSTGRES_SSL === "true" || false;
// @ts-ignore
const pool = new pg.Pool({ connectionString, ssl });

const client = await pool.connect();

async function createMessage(
  sender: string,
  recipient: string,
  message: string,
): Promise<void> {
  try {
    const getConversation = `SELECT "conversationId" FROM "Conversation" WHERE ("user1Id"='${sender}' AND "user2Id"='${recipient}') OR
                                      ("user1Id"='${recipient}' AND "user2Id"='${sender}')`;
    let result: QueryResult;
    result = await client.query(getConversation);
    const conversationExists: boolean = result.rows.length > 0;

    if (!conversationExists) {
      result = await createConversation(sender, recipient);
    }

    // @ts-ignore
    const insertMessage: string = `INSERT INTO "Message"("senderId", "conversationId", "content", "timestamp") VALUES('${sender}','${result.rows[0].conversationId}', '${message}', 'now()')`;
    await client.query(insertMessage);

    console.log("New message");
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
}

async function createConversation(
  user1Id: string,
  user2Id: string,
): Promise<QueryResult> {
  try {
    const insertMessage: string = `INSERT INTO "Conversation"("user1Id", "user2Id", "lastMessageAt")
                           VALUES ('${user1Id}', '${user2Id}', 'now()') RETURNING "conversationId"`;
    const result: QueryResult = await client.query(insertMessage);
    console.log("New conversation");
    return result;
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
}

export default createMessage;
