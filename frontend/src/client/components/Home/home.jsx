import { useNavigate } from 'react-router-dom';

function Home(){
    const navigate = useNavigate();
    const navigatehome = () => {
        navigate('/Home');
    };

    return(
        <div>
            <h1>HOLAAAA </h1>
        </div>
    )

}

export default Home