import React, { useState, useEffect } from 'react'
import List from './List'
import Alert from './Alert'

const getLocalStorage = () => {
  let storage = localStorage.getItem('list');
  if(storage){
    return JSON.parse(localStorage.getItem('list'));
  }
  return [];
}

function App() {
  const [name,setName] = useState('');
  const [list,setList] = useState(getLocalStorage);
  const [isEditing,setIsEditing] = useState(false);
  const [editId,setEditId] = useState(null);
  const [alert,setAlert] = useState({ show: false, msg: '', type: '' })

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) {
      showAlert(true,'danger','please add item');
    } else if(name && isEditing){
      //edit
      setList(
        list.map((item) => {
          if (item.id === editId) {
          return {...item, title: name }
        }
          return item
        })
      )
      setEditId(null);
      setIsEditing(false);
      setName('');
      showAlert(true,'success','Item changed');
    } else {
      showAlert(true,'success','Item added');
      const newItem = { id: new Date().getTime().toString(), title: name }
      setList([...list, newItem]);
      setName('');
    }
  }
  
  const showAlert = (show = false, type = '', msg = '') => {
    setAlert({show,type,msg});
  }

  const clearList = () => {
    showAlert(true,'danger','Empty list');
    setList([]);
  }

  const removeItem = (id) => {
    showAlert(true,'danger','Item removed');
    setList(list.filter(item => item.id !== id) );
  }

  const editItem = (id) => {
    const specificItem = list.find((item) => item.id === id );
    setEditId(id);
    setIsEditing(true);
    setName(specificItem.title); 
  }

  useEffect(() => {
    localStorage.setItem('list', JSON.stringify(list))
  },[list])

  return (
    <section className='section-center'>
      <form className='grocery-form' onSubmit={handleSubmit}>
        {alert.show && <Alert {...alert} removeAlert={showAlert} list={list} />}
        <h3>Grocery bud</h3>
        <div className='form-control'>
        <input 
          type='text' className='grocery'
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          placeholder='e.g bread' 
        />
        <button type='submit' className='submit-btn'>
          {isEditing ? 'edit' : 'submit'}
        </button>  
        </div>
      </form>
      {list.length > 0 && 
        <div className='grocery-container'>
          <List items={list} removeItem={removeItem} editItem={editItem} />
          <button className='clear-btn' onClick={ clearList }>clear items</button>
        </div>
      }
    </section>
  )
}

export default App