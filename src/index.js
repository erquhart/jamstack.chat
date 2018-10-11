import React from 'react'
import ReactDOM from 'react-dom'
import { sortBy } from 'lodash'
import firebase from 'firebase'
import 'firebase/firestore'

firebase.initializeApp({
  apiKey: "AIzaSyB2Ye34x-sAJY3SSQDdDL2EWjtx_mqEHBQ",
  authDomain: "chat-2769e.firebaseapp.com",
  projectId: "chat-2769e",
})

const db = firebase.firestore()

db.settings({
  timestampsInSnapshots: true,
})

const MessageList = ({ data, onDelete }) => (
  <div>
    {sortBy(data, ['timestamp']).map(({ id, content }, idx) => (
      <div key={idx}>
        {content}
        <button onClick={() => onDelete(id)}>x</button>
      </div>
    ))}
  </div>
)

class App extends React.Component {
  state = {
    input: '',
    data: [],
  }

  componentDidMount() {
    db.collection('messages').onSnapshot(snapshot => {
      const data = []
      snapshot.forEach(doc => data.push({ id: doc.id, ...doc.data() }))
      this.setState({ data })
    })
  }

  handleChange = e => {
    this.setState({ input: e.target.value })
  }

  add = value => {
    db.collection('messages').add({ content: value, timestamp: Date.now() })
  }

  deleteMessage = id => {
    db.collection('messages').doc(id).delete()
  }

  render() {
    const { input, data } = this.state
    return (
      <div>
        <input value={input} onChange={this.handleChange}/>
        <button onClick={() => this.add(input)}>add</button>
        <MessageList data={data} onDelete={this.deleteMessage}/>
      </div>
    )
  }
}

const root = document.getElementById('root')
ReactDOM.render(<App/>, root)
