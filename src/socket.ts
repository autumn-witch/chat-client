import { io } from 'socket.io-client';
import { config } from "dotenv";
config();

const url: string = process.env.URL!

export const socket = io(url);

socket.on("broadcastMessage", (data) => {
	console.log(data)
})