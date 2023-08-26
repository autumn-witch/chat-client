'use client'

import { useState } from "react"
import { useSearchParams } from 'next/navigation'
import { socket } from '../../socket';

type Message = {
	content: string,
	author: User,
	date: string
}

function isValidUUID(roomId: string | null): boolean {
  const regexExp = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
	if(!roomId) {
		return false;
	}
  return regexExp.test(roomId);
}

function sendMessage(
	event: any,
	messageContent: string,
	author: string,
	uuid: string,
	messages: Array<Message>,
	setMessage: Function,
	setMessages: Function
) {
	const date = new Date();
	const formattedMinutes = String(date.getMinutes()).padStart(2, "0");
	if(event.key === 'Enter') {
		const message = {
			content: messageContent,
			author,
			date: `${date.getHours()}:${formattedMinutes}`,
			uuid
		}
		socket.emit("sendMessage", message);
		setMessages([...messages, message]);
		setMessage("");
		const chatContent = document.getElementById('chat-content')!;
  	chatContent.scrollTop = chatContent.scrollHeight;
	}
}

function joinRoom(roomId: string) {
	socket.emit("createRoom", roomId);
}

function Chat() {
	const searchParams = useSearchParams();
	const roomId = searchParams!.get('roomId');
	joinRoom(roomId!);
	
	const [messages, setMessages] = useState<Message[]>([]);

	const [name, setName] = useState("")

	const [message, setMessage] = useState("");

	socket.on("broadcastMessage", (message: Message) => {
		setMessages([...messages, message]);
	})

	return (
		<section className="chat h-5/6 w-5/6 border border-white rounded-2xl flex flex-col">
			<header className="chat-header h-1/6 w-full border-b border-white flex items-center justify-center">Chat</header>
			<section className="chat-content h-2/3" id="chat-content">
				{ messages.map((message, id) =>
					(<div key={id}>({message.date}) {message.author}: {message.content}</div>))
				}
			</section>
			<footer className="h-1/6 w-full border-t border-white mt-auto flex justify-around items-center">
				<input
					className="name-input h-5/6 border rounded-2xl"
					type="text"
					name="input-name"
					id="input-name"
					placeholder="Nom"
					value={ name }
					onChange={
						(event) => setName(event.target.value)
					}
				/>
				<input
					className="h-5/6 w-3/4 border rounded-2xl"
					type="text"
					name="input-message"
					id="input-message"
					placeholder="Saisissez votre message..."
					value={ message }
					onChange={
						(event) => setMessage(event.target.value)
					}
					onKeyDown={
						(event) => {
							return sendMessage(event, message, name, roomId!, messages, setMessage, setMessages)
						}
					}
				/>
			</footer>
		</section>
	)
}

export default function Page() {
	const searchParams = useSearchParams();
	const roomId = searchParams!.get('roomId');
	if(!isValidUUID(roomId)) {
		return (
			<div>Ce n'est pas une room valide</div>
		)
	}
	return (
		<Chat />
	)
}