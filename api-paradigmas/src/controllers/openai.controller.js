import { OpenAI } from "openai";

const apiKey = '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';
const openai = new OpenAI({ apiKey: apiKey });

export const enviarMensaje = async (req, res) => {
    try {
        const { inputValue } = req.body;

        if (inputValue.toLowerCase().includes("generar una imagen")) {
            const imageResponse = await openai.images.generate({
                model: "dall-e-2",
                prompt: `Utiliza tu imaginación y crea una imagen sorprendente basada en "${inputValue}". ¡Sé tan creativo como puedas!`
            });
            const imageURL = imageResponse.data[0].url;
            res.json({ text: "Aquí está la imagen generada:", imageUrl: imageURL });
        } else {
            const response = await openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [{
                    role: 'user',
                    content: `Déjate llevar por la creatividad y responde de manera original a "${inputValue}".`
                }],
            });

            const botMessage = response.choices[0].message.content.trim();
            res.json({ text: botMessage });
        }
    } catch (error) {
        console.error("Error al obtener la respuesta de OpenAI:", error);
        res.status(500).json({ error: "Error al obtener la respuesta de OpenAI" });
    }
}
