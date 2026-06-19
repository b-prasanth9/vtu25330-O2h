const express = require('express');
const { listTasks, addTask, completeTask, removeTask } = require('../controllers/taskController');

const router = express.Router();

router.get('/', listTasks);
router.post('/', addTask);
router.put('/:id', completeTask);
router.delete('/:id', removeTask);

module.exports = router;
