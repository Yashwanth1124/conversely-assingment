import React, {useState} from 'react'
import './Matrix.css'

const Matrix = () => {
  const initialColors = Array(9).fill('white')
  const [colors, setColors] = useState(initialColors)
  const [clickOrder, setClickOrder] = useState([])

  const generateKey = index => `box-${index}`

  const changeToOrange = order => {
    const newColors = [...colors]
    order.forEach((idx, i) => {
      setTimeout(() => {
        newColors[idx] = 'orange'
        setColors([...newColors])
      }, i * 300)
    })
  }

  const handleClick = index => {
    if (colors[index] !== 'green') {
      const newColors = [...colors]
      newColors[index] = 'green'
      setColors(newColors)
      setClickOrder([...clickOrder, index])
      if (clickOrder.length === 8) {
        setTimeout(() => {
          changeToOrange([...clickOrder, index])
        }, 500)
      }
    }
  }
  return (
    <div className="matrix">
      {colors.map((color, index) => (
        <div
          key={generateKey(index)}
          className="box"
          style={{backgroundColor: color}}
          onClick={() => handleClick(index)}
          role="button"
          tabIndex={0}
          onKeyPress={() => handleClick(index)}
          aria-label={`box${index + 1}`}
        />
      ))}
    </div>
  )
}

export default Matrix
