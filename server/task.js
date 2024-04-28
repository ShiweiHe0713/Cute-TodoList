// In your routes file (e.g., routes/tasks.js)
router.post('/tasks', tasksController.createTask);

// In your controller file (e.g., controllers/tasksController.js)
exports.createTask = async (req, res) => {
    try {
        const task = new Task({
            title: req.body.title,
            completed: false
        });
        await task.save();
        res.status(201).send(task);
    } catch (error) {
        res.status(400).send(error);
    }
};

// In your routes file
router.get('/tasks/:id', tasksController.getTask);

// In your controller file
exports.getTask = async (req, res) => {
    const _id = req.params.id;
    try {
        const task = await Task.findById(_id);
        if (!task) {
            return res.status(404).send();
        }
        res.send(task);
    } catch (error) {
        res.status(500).send();
    }
};

// In your routes file
router.put('/tasks/:id', tasksController.updateTask);

// In your controller file
exports.updateTask = async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['title', 'completed'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }

    try {
        const task = await Task.findById(req.params.id);
        updates.forEach(update => task[update] = req.body[update]);
        await task.save();

        if (!task) {
            return res.status(404).send();
        }
        res.send(task);
    } catch (error) {
        res.status(400).send(error);
    }
};

// In your routes file
router.delete('/tasks/:id', tasksController.deleteTask);

// In your controller file
exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) {
            return res.status(404).send();
        }
        res.send(task);
    } catch (error) {
        res.status(500).send();
    }
};

// In your routes file
router.get('/tasks', tasksController.listTasks);

// In your controller file
exports.listTasks = async (req, res) => {
    const match = {};
    if (req.query.completed) {
        match.completed = req.query.completed === 'true';
    }

    try {
        const tasks = await Task.find(match);
        res.send(tasks);
    } catch (error) {
        res.status(500).send();
    }
};
