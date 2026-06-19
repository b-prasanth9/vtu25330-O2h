const express = require('express');
const { listTasks, addTask, completeTask, removeTask, stats } = require('../controllers/taskController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, listTasks);
router.get('/stats', auth, stats);
router.post('/', auth, addTask);
router.put('/:id', auth, completeTask);
router.delete('/:id', auth, removeTask);

module.exports = router;
