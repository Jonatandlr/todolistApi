import express from 'express';
import cors from 'cors';
import { prisma } from './prisma.js';
const port = 3000

const app = express();
app.disable('x-powered-by');

// const OriginsAccess = [
//   'http://localhost:3001',
// ]

const corsOptions = {
  origin: [
    'http://localhost:3001',
    'http://localhost:3000',
    'https://todolistapp-umber.vercel.app'
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(express.json());

// app.options('*', (req, res) => {
//   const origin = req.headers.origin;
//   if (OriginsAccess.includes(origin)||!origin) {
//     res.setHeader('Access-Control-Allow-Origin', origin);
//     res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
//     res. setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//   }
//   res.status(200)
// })



//Metodos GET
app.get('/', (req, res) => {
  res.send('Hello!');
});
//Obtiene todas las notas de la db
app.get('/notes', async (req, res) => {
  const notes = await prisma.note.findMany({
    include: {
      categories: true,
    },
  })
  res.json(notes)
});

//Obtiene todas las categorias de la db
app.get('/categories', async (req, res) => {
  const categories = await prisma.category.findMany({
    include: {
      notes: true,
    },
  })
  res.json(categories)
});

//obtiene una nota de la db
app.get('/notes/:id', async (req, res) => {
  const { id } = req.params
  const note = await prisma.note.findUnique({
    where: { id: Number(id) },
    include: {
      categories: true,
    },
  })
  res.json(note)
});
//obtener las notas por categoria
app.get('/categories/notes/:category', async (req, res) => {
  const { category } = req.params
  //ver si existe la categoria
  const categoryExist = await prisma.category.findUnique({
    where: { name: category },
  })
  if (!categoryExist) {
    return res.status(404).json({ error: 'Category not found' });
  }
  //obtener las notas de la categoria
  const notes = await prisma.note.findMany({
    where: {
      categories: {
        some: {
          category: {
            name: category
          }
        }
      }
    },
    include: {
      categories: true,
    },
  })

  res.json(notes)
} );



//Metodos Post
//Agrega una nota a la db
app.post('/notes/add', async (req, res) => {
  const { title, description, categories } = req.body;
  try {
    const note = await prisma.note.create({
      data: {
        title,
        description,
        categories: {
          create: categories.map(category => ({
            category: { connect: { name: category } }
          }))
        }
      },
      include: {
        categories: true
      },
    })
    res.json({ message: "Note added Correctly" })
  } catch (error) {
    console.error('Error al crear la nota con la categoría existente:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

//Agrega una categoria a la db
app.post('/categories/add', async (req, res) => {
  const { name } = req.body
  const category = await prisma.category.create({
    data: {
      name
    },
    include: {
      notes: true
    },
    
  })
  res.json(category)
})


//Metodo PUT

//nota completada 
app.put('/notes/completed/:id', async (req, res) => {
  const { id } = req.params
  const {completed}=req.body

  const findNote = await prisma.note.findUnique({
    where: { id: Number(id) },
  })
  if (!findNote) {
    return res.status(404).json({message:id});
  }
  const note = await prisma.note.update({
    where: { id: Number(id) },
    data: { completed:completed},
  })
  res.json(note)
})

//Actualiza una nota de la db
app.put('/notes/update/:id', async (req, res) => {
  const { title, description,categories} = req.body
  const { id } = req.params
  try {
    const note = await prisma.note.update({
      where: { id: Number(id) },
      data: {
        title,
        description,
        categories: {
          deleteMany: {},
          create: categories.map(category => ({
            category: { connect: { name: category } }
          }))
        }
      },
      include: {
        categories: true
      },
    })
    res.json(note)
  } catch (error) {
    console.error('Error al actualizar la nota:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

//actualiza una categoria de la db
app.put('/categories/update/:id', async (req, res) => {
  const { name } = req.body
  const { id } = req.params
  try {
    const category = await prisma.category.update({
      where: { id: Number(id) },
      data: {
        name
      },
    })
    res.json(category)
  } catch (error) {
    console.error('Error al actualizar la categoría:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});



//Metodo Delete
//eliminar una nota de la db
app.delete('/notes/delete/:id', async (req, res) => {
  const { id } = req.params
  const findNote = await prisma.note.findUnique({
    where: { id: Number(id) },
  })
  if (!findNote) {
    return res.status(404).json({ error: 'Note not found' });
  }  
  const deleteNote=await prisma.note.delete({
    where: { id: Number(id) },
  })
  res.json(deleteNote)
 
})

//eliminar una categoria de la db
app.delete('/categories/delete/:id', async (req, res) => {
  const { id } = req.params
  const findCategory = await prisma.category.findUnique({
    where: { id: Number(id) },
  })
  if (!findCategory) {
    return res.status(404).json({ error: 'Category not found' });
  }  
  const deleteCategory=await prisma.category.delete({
    where: { id: Number(id) },
  })
  res.json(deleteCategory)
 
})


app.listen(port, () => {
  console.log(`Example app listening  http://localhost:${port}`);
});
