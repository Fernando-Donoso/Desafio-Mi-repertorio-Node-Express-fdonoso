import express from "express";
import cors from "cors";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("public"));


const leerCanciones = () => {
  try {
    const data = fs.readFileSync("repertorio.json", "utf8");
    return JSON.parse(data);
  } catch (error) {
    fs.writeFileSync("repertorio.json", "[]");
    return [];
  }
};


const guardarCanciones = (canciones) => {
  fs.writeFileSync("repertorio.json", JSON.stringify(canciones, null, 2));
};

// GET /canciones
app.get("/canciones", (req, res) => {
  try {
    const canciones = leerCanciones();
    res.json(canciones);
  } catch (error) {
    res.status(500).json({
      error: "Error al obtener las canciones",
    });
  }
});

// POST /canciones
app.post("/canciones", (req, res) => {
  try {
    const { titulo, artista, tono } = req.body;

    const canciones = leerCanciones();

    const nuevaCancion = {
      id: uuidv4(),   // el backend genera el id
      titulo,
      artista,
      tono,
    };

    canciones.push(nuevaCancion);
    guardarCanciones(canciones);

    res.status(201).json({ mensaje: "Canción agregada correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al agregar la canción" });
  }
});



// PUT /canciones/:id

app.put("/canciones/:id", (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, artista, tono } = req.body;
    const canciones = leerCanciones();
    const index = canciones.findIndex((cancion) => cancion.id === id);
    if (index === -1) {
      return res.status(404).json({
        error: "Canción no encontrada",
      });
    }
    canciones[index] = {
      id,
      titulo,
      artista,
      tono,
    };

    guardarCanciones(canciones);

    res.json({
      mensaje: "Canción actualizada correctamente",
    });
  } catch (error) {
    res.status(500).json({
      error: "Error al actualizar la canción",
    });
  }
});

// DELETE /canciones/:id

app.delete("/canciones/:id", (req, res) => {
  try {
    const { id } = req.params;

    const canciones = leerCanciones();
    const cancionesFiltradas = canciones.filter((cancion) => cancion.id !== id);
    guardarCanciones(cancionesFiltradas);

    res.json({
      mensaje: "Canción eliminada correctamente",
    });
  } catch (error) {
    res.status(500).json({
      error: "Error al eliminar la canción",
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
