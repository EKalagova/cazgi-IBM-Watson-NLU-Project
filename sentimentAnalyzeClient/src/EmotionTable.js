import React from 'react';
import './bootstrap.min.css';

class EmotionTable extends React.Component {
    render() {
      return (  
        <div>
          <table className="table table-bordered" style={{ margin: '1em 0' }}>
            <tbody>
            {
                Object.keys(this.props.emotions).map((emotion, index) => (
                    <tr key={index}>
                        <td>{emotion}</td>
                        <td>{this.props.emotions[emotion]}</td>
                    </tr>
                ))
            }
            </tbody>
          </table>
          </div>
          );
        }
    
}
export default EmotionTable;
