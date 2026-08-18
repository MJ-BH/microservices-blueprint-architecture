const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4003;

app.use(cors());
app.use(express.json());

// In-memory file & folder mock database matching FileItem domain model
let mockFiles = [
  { id: 'f1', name: 'Documents', type: 'folder', sizeInBytes: 0, lastModified: '2026-08-16T10:00:00Z', parentId: null },
  { id: 'f2', name: 'Design_Tokens', type: 'folder', sizeInBytes: 0, lastModified: '2026-08-15T14:30:00Z', parentId: null },
  { id: 'f3', name: 'Clean_Architecture_Guide.pdf', type: 'pdf', sizeInBytes: 3200000, lastModified: '2026-08-17T09:15:00Z', parentId: null },
  { id: 'f4', name: 'VGV_Monorepo_Setup.doc', type: 'document', sizeInBytes: 180000, lastModified: '2026-08-17T11:20:00Z', parentId: null },
  { id: 'f1_1', name: 'Jetpack_Compose_v2.pdf', type: 'pdf', sizeInBytes: 4500000, lastModified: '2026-08-18T01:00:00Z', parentId: 'f1' },
  { id: 'f1_2', name: 'Ktor_Auth_Interceptor.doc', type: 'document', sizeInBytes: 220000, lastModified: '2026-08-18T01:10:00Z', parentId: 'f1' }
];

// GET /api/v1/explorer - Fetch items inside folder
app.get('/api/v1/explorer', (req, res) => {
  const folderId = req.query.folderId || null;
  const items = mockFiles.filter(file => file.parentId === (folderId === 'null' ? null : folderId));
  res.json({ success: true, data: items });
});

// POST /api/v1/explorer/folders - Create folder
app.post('/api/v1/explorer/folders', (req, res) => {
  const { name, parentId } = req.body;
  const newFolder = {
    id: `folder_${Date.now()}`,
    name: name || 'New Folder',
    type: 'folder',
    sizeInBytes: 0,
    lastModified: new Date().toISOString(),
    parentId: parentId || null
  };
  mockFiles.push(newFolder);
  res.status(201).json({ success: true, data: newFolder });
});

// DELETE /api/v1/explorer/:id - Delete item
app.delete('/api/v1/explorer/:id', (req, res) => {
  const { id } = req.params;
  mockFiles = mockFiles.filter(file => file.id !== id && file.parentId !== id);
  res.json({ success: true, message: 'Item deleted successfully' });
});

app.listen(PORT, () => {
  console.log(`Explorer Service running on port ${PORT}`);
});
