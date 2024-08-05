import React from 'react'
import YoutubeVideo from '../../components/YoutubeVideo'

const TestPage = () => {
  const obj = { link: "https://www.youtube.com/watch?v=ONzdr4SmOng", locale: "" , overlay: true}
  return (
    <div>
      <p>Youtube</p>
      <YoutubeVideo {...obj}/>
    </div>

  )
}

export default TestPage