const Todo = require('../models/Todo');
const User = require('../models/User');

const todoController = {
    getAllTodos: async (req, res) => {
        try {
            const todos = await Todo.find({ user: req.user._id });
            res.json(todos);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    createTodo: async (req, res) => {
        try {
            const { title, description } = req.body;
            const todo = new Todo({
                title,
                description,
                completed: false,
                user: req.user._id
            });
            const savedTodo = await todo.save();
            
            await User.findByIdAndUpdate(
                req.user._id,
                { $push: { todos: savedTodo._id } }
            );

            res.status(201).json(savedTodo);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    updateTodo: async (req, res) => {
        try {
            const { id } = req.params;
            const { title, description, completed } = req.body;
            
            const todo = await Todo.findOneAndUpdate(
                { _id: id, user: req.user._id },
                { title, description, completed },
                { new: true }
            );

            if (!todo) {
                return res.status(404).json({ message: 'Todo not found' });
            }
            
            res.json(updatedTodo);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    deleteTodo: async (req, res) => {
        try {
            const { id } = req.params;
            const todo = await Todo.findOne({
                _id: id,
                user: req.user._id
            });
            
            if (!todo) {
                return res.status(404).json({ message: 'Todo not found' });
            }

            await todo.remove();
            
            await User.findByIdAndUpdate(
                req.user._id,
                { $pull: { todos: id } }
            );

            res.status(200).json({ message: 'Todo deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = todoController;
