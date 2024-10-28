const express = require("express");
const cors = require("cors");
const path = require("path");
const Groq = require("groq-sdk"); // Importer le SDK Groq

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Configurer le client Groq
const groq = new Groq({
  apiKey: "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", // Remplacez par votre clé API Groq
});

// Servir les fichiers statiques depuis le dossier "public"
app.use(express.static(path.join(__dirname, "public")));

// Route pour l'API
app.post("/api/ask", async (req, res) => {
  try {
    const { message } = req.body;

    // Interaction avec l'API Groq
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "Reformule cette phrase de manière à ce que l'IA comprenne précisément le contexte et l'objectif de la demande. Inclue des détails supplémentaires si nécessair et ajoute toute contrainte ou information pertinente pour rendre le prompt plus clair et complet. Ne repond pas a la question. Ton seul but est de me fournir une question améliorée. N'ajoute pas de commentaire.",
        }, // Ajout du rôle system
        { role: "user", content: message }, // Message de l'utilisateur
      ],
      model: "mixtral-8x7b-32768", // Remplacez par le modèle que vous voulez utiliser
      temperature: 0.2,
      max_tokens: 130,
    });

    const aiResponse = chatCompletion.choices[0].message.content;
    res.json({ response: aiResponse });
  } catch (error) {
    console.error("Erreur lors de la requête à l'API Groq:", error.message); // Affiche le message d'erreur dans la console
    res.status(500).json({ error: "Erreur lors de la requête à l'API Groq." });
  }
});

// Redirection pour le GET /
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Lancer le serveur
app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
