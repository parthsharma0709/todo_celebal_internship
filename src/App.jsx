import { useState ,useEffect,useRef} from "react";
import { v4 as uuidv4 } from 'uuid';
function App() {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [completeTask,setCompleteTask]=useState(false);
  const [showFilteredTodos,setFilteredTodos]=useState([]);
  const isFirstLoad = useRef(true);
  const [showRecent,setShowRecent]=useState(true);

  
  // Load todos on mount
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("storedTodos") || "[]");
    setTodos(saved);
  }, []);

  // Save todos to localStorage whenever updated
 useEffect(() => {
  if (isFirstLoad.current) {
    isFirstLoad.current = false;
    return; // skip saving on first load
  }
  localStorage.setItem("storedTodos", JSON.stringify(todos));
}, [todos]);


  
  const deleteTodo = (id) => {
  const updatedTodos = todos.filter(todo => todo.id !== id);
  setTodos(updatedTodos);
};

 const editTodo = (id) => {
  const index = todos.findIndex(todo => todo.id === id);
  if (index === -1) return; // ID not found
  setEditingIndex(id);
  setTask(todos[index].title);
  setCompleteTask(todos[index].completed);
  setFilteredTodos([]);
};





 const addOrUpdateTodo = () => {
  const trimmedTask = task.trim();

  if (trimmedTask === "") {
    alert("Please add a todo");
    return;
  }
  if(trimmedTask.length>500){
    alert("task is too long ");
    return;
  }

  // Case-insensitive duplicate check
  const isDuplicate = todos.some(
    todo => todo.title.toLowerCase() === trimmedTask.toLowerCase()
  );

  if (editingIndex !== null) {
    const updatedTodos = todos.map(todo =>
      todo.id === editingIndex
        ? { ...todo, title: trimmedTask, completed: completeTask }
        : todo
    );
    setTodos(updatedTodos);
    setEditingIndex(null);
  } else if (!isDuplicate) {
    const newTodo = {
      id: uuidv4(),
      title: trimmedTask,
      completed: completeTask,
      createdAt: new Date()
    };
    setTodos([...todos, newTodo]);
  
  } else {
    alert("Todo has already been added");
    return;
  }

  setTask("");
  setCompleteTask(false);
};

const completedCount= todos.filter(todo=> todo.completed===true).length;
 const showCompleted=()=>{
            const updatedTodos=todos.filter(todo=>todo.completed===true);
            setFilteredTodos(updatedTodos);
          
       
 }
 const showInCompleted= ()=>{
  const updatedTodos=todos.filter(todo=> todo.completed===false);
  setFilteredTodos(updatedTodos)
  
 }
 const showAll=()=>{
  setFilteredTodos([]);
  
 }

  const sortedTodos = [...(showFilteredTodos.length ? showFilteredTodos : todos)]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return (
    <div className="h-screen w-screen bg-gradient-to-br from-slate-700 to-slate-900 flex justify-center items-center">
      <div className="w-[800px] min-h-[700px] bg-white/5 backdrop-blur border border-white/10 rounded-2xl shadow-xl p-6">
        <h1 className="text-2xl text-white font-semibold mb-6 text-center"> Todo List</h1>

        {/* Input Section */}
        <div className="flex gap-4 mb-6">
          <input
            className="flex-1 p-3 rounded-xl bg-white/10 text-white placeholder-white/50 outline-none border border-white/20 focus:ring-2 focus:ring-white"
            type="text"
            placeholder="Add your todo..."
            name="todo"
            value={task}
            onChange={(e) => setTask(e.target.value)}
          />
          <button
            className="px-5 py-3 bg-white text-black font-semibold rounded-xl hover:bg-gray-200 transition"
            onClick={addOrUpdateTodo}
          >
            {editingIndex !== null ? "Update" : "Add"}
          </button>
        </div>
        <div className="flex justify-around bg-white mb-5  border rounded">
        <button onClick={()=>setShowRecent(c=>!c)} className="p-3 m-1 bg-black text-white border rounded">{ showRecent=== true?"Show Oldest":"Show Recent"}</button>
          <button onClick={showAll}  className="p-3 m-1 bg-black text-white border rounded">All Tasks : {todos.length}</button>
          <button onClick={showCompleted} className="p-3 m-1 bg-black text-white border rounded">Completed Tasks : {completedCount}</button>
          <button onClick={showInCompleted} className="p-3 m-1 bg-black text-white border rounded">Incompleted Tasks : {todos.length-completedCount}</button>
        </div>


        {/* Todo List Section */}
        <ul className="space-y-3 max-h-[440px] overflow-y-auto pr-2">
           { (showRecent=== true? sortedTodos:todos).map((todo) => (
            <li
              key={todo.id}
              className="bg-white/10 text-white flex items-center justify-between px-4 py-3 rounded-lg shadow hover:bg-white/20 transition"
            >
              <span className="truncate">{todo.title}</span>
              <div className="flex gap-2">
              <input
  type="checkbox"
  checked={todo.completed}
  onChange={() => {
    const updatedTodos = todos.map(t =>
      t.id === todo.id ? { ...t, completed: !t.completed } : t
    );
    setTodos(updatedTodos);
  }}
  className="w-6 h-7 mr-3"
/>

                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm"
                >
                  Delete
                </button>
                <button
                  onClick={() => editTodo(todo.id)}
                  className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm"
                >
                  Edit
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
