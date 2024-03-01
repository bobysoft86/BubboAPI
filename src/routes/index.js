const { Router } = require("express");
const router = Router();
const serviceAccount = require("../examplebubbo-firebase-adminsdk-8tdby-e7c51ad61b.json");
var admin = require("firebase-admin");


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
router.get("/books", async (req, res) => {
    try {
      const snapshot = await db.collection("books").get();
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      console.log(data);
      res.json(data);
    } catch (error) {
      console.error("Error al obtener datos:", error);
      res.status(500).json({ error: "Error al obtener datos" });
    }
  });

router.get("/books/:id", async (req, res) => {
  try {
    const bookId = req.params.id;
    const docRef = db.collection("books").doc(bookId);

    const doc = await docRef.get();
    if (!doc.exists) {
      res.status(404).send("Libro no encontrado");
      return;
    }

    const bookData = doc.data();
    console.log(bookData);
    res.json(bookData);
  } catch (error) {
    console.error("Error al obtener detalles del libro:", error);
    res.status(500).send("Error al obtener detalles del libro");
  }
});

router.post("/books", async (req, res) => {
  try {
    const { title, author, genre, img } = req.body; 
    console.log(req.body)
    if (!title || !author || !genre || !img) {
      res.status(400).send("Campos faltantes en la solicitud");
      return;
    }

    const newBookRef = await db.collection("books").add({
      title,
      author,
      genre,
      img,
    });

    const newBookId = newBookRef.id;
    console.log(`Nuevo libro creado con ID: ${newBookId}`);

    res.status(201).json({ id: newBookId });
  } catch (error) {
    console.error("Error al crear un nuevo libro:", error);
    res.status(500).send("Error al crear un nuevo libro");
  }
});

router.put("/books/:id", async (req, res) => {
  try {
    const bookId = req.params.id;
    const { title, author, genre,img } = req.body;

    if (!title && !author && !genre && !img) {
      res.status(400).send("Ningún campo proporcionado para la actualización");
      return;
    }

    const bookRef = db.collection("books").doc(bookId);
    const bookDoc = await bookRef.get();

    if (!bookDoc.exists) {
      res.status(404).send("Libro no encontrado");
      return;
    }

    const updatedData = {};

    if (title) updatedData.title = title;
    if (author) updatedData.author = author;
    if (genre) updatedData.genre = genre;
    if (img) updatedData.img = img;


    await bookRef.update(updatedData);

    console.log(`Libro con ID ${bookId} actualizado`);
    res.status(200).send("Libro actualizado correctamente");
  } catch (error) {
    console.error("Error al actualizar el libro:", error);
    res.status(500).send("Error al actualizar el libro");
  }
});

router.delete("/books/:id", async (req, res) => {
  try {
    const bookId = req.params.id;

    const bookRef = db.collection("books").doc(bookId);
    const bookDoc = await bookRef.get();

    if (!bookDoc.exists) {
      res.status(404).send("Libro no encontrado");
      return;
    }

    await bookRef.delete();

    console.log(`Libro con ID ${bookId} eliminado`);
    res.status(204).send(); 
  } catch (error) {
    console.error("Error al eliminar el libro:", error);
    res.status(500).send("Error al eliminar el libro");
  }
});
module.exports = router;
