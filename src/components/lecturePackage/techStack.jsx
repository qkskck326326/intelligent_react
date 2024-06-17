import React from 'react';
import { useDrag, useDrop } from 'react-dnd';


const TechStack = ({ stack }) => {
    const [{ isDragging }, drag] = useDrag({
        type: 'TECH_STACK',
        item: stack,
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    return (
        <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1, cursor: 'move', margin: '10px' }}>
            <img src={stack.techStackPath} alt={stack.techStackName} style={{ width: '50px', height: '50px' }} />
            <span>{stack.techStackName}</span>
        </div>
    );
};


const DropZone = ({ onDrop, selectedStacks, onRemove }) => {
    const [{ isOver }, drop] = useDrop({
        accept: 'TECH_STACK',
        drop: (item) => onDrop(item),
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
    });

    return (
        <div ref={drop} style={{ border: '1px solid black', minHeight: '300px', padding: '10px', backgroundColor: isOver ? 'lightgrey' : 'white', display: 'flex', flexWrap: 'wrap' }}>
            {selectedStacks.map(stack => (
                <div key={stack.techStackId} style={{ margin: '10px', position: 'relative' }}>
                    <img src={stack.techStackPath} alt={stack.techStackName} style={{ width: '50px', height: '50px' }} />
                    <span>{stack.techStackName}</span>
                    <button onClick={() => onRemove(stack.techStackId)} style={{ position: 'absolute', top: '0', right: '0', background: 'red', color: 'white', border: 'none', borderRadius: '50%' }}>x</button>
                </div>
            ))}
        </div>
    );
};

export { TechStack, DropZone };