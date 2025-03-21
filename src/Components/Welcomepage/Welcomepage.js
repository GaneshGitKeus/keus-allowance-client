// import Keusname from './Keusname.png';
import './Welcomepage.css';
import Hello from "./Hello.png"
function Welcomepage() {
  return (
    <div className="Home">
      <div className="Keus-Name">
        {/* <img src={Keusname}alt="Sorry No Image" className="Keusname" /> */}
      </div>
      <div className="Introduction"> <br />
        <input type="text" value="Hello" className="Introduction-text" />
        <input type="text" value="Ganesh" className="Intro-Name" />

        <img src={Hello} alt="Sorry No Image" className="Hello-Image" />
      </div>
    </div>


  )
}
export default Welcomepage;