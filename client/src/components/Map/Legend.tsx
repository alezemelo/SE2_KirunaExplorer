import './Legend.css';
import { stringToColor } from '../../Utils/utils';


function Legend(props: any) {

    const uniqueDocumentTypes = Array.from(
        new Set(props.documents.map((doc: any) => doc.type)) // Ensure the Set contains strings
    ) as string[]; // Cast the resulting array to string[]

    return (
        <div className="legend">
            <p className='legend-title'>Legend</p>
            <ul className='legend-list'>
                {uniqueDocumentTypes.map((type: string) => (
                    <LegendItem key={type} name={type} />
                ))}
            </ul>
        </div>
    );
}

function LegendItem(props: any) {
    return (
        <li className="legend-item">
            <span 
                className="legend-indicator" 
                style={{ backgroundColor: stringToColor(props.name) }}
            />
            {props.name}</li>
    );
}

export default Legend;