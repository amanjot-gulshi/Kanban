import React, { useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { Container } from 'react-bootstrap';
import { v4 as uuid } from "uuid";

function App() {

  const items = [
    { id: uuid(), content: "First task" },
    { id: uuid(), content: "Second task" },
    { id: uuid(), content: "Third task" },
    { id: uuid(), content: "Fourth task" },
    { id: uuid(), content: "Fifth task" },
    { id: uuid(), content: "Sixth task" },
    { id: uuid(), content: "Seventh task" }
  ];

  const progressColumns = {

    [uuid()]: {
      name: "To do",
      items: items
    },
    [uuid()]: {
      name: "In Progress",
      items: []
    },
    [uuid()]: {
      name: "Done",
      items: []
    }
  };

  const dragEnd = (result, columns, setColumns) => {
    console.log(result)

    // Return if result destination is null.
    if (!result.destination) return;

    const { source, destination } = result;

    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);

      destItems.splice(destination.index, 0, removed);

      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems
        }
      });

    } else {
      const column = columns[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems
        }
      });
    }
  }

  const [columns, setColumns] = useState(progressColumns);

  return (
    <div style={{ backgroundColor: "#E5E4E2" }}>
      <div>
        <h1 style={{ textAlign: "center" }}>Kanban Board</h1>
      </div>

      <Container className='kanban-container'>
        <DragDropContext onDragEnd={result => dragEnd(result, columns, setColumns)}>

          {Object.entries(columns).map(([columnId, column], index) => (
            <div className='task-columns'
              key={columnId}
            >
              <h2>{column.name}</h2>
              <Droppable
                droppableId={columnId}
                key={columnId}
                direction='vertical'
                type="column"
              >
                {(provided, snapshot) => (

                  <div
                    className='my-4 column'
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={{
                      borderRadius: "10px",
                      background: snapshot.isDraggingOver
                        ? "lightblue"
                        : "lightgrey",
                      padding: 4,
                      width: 250,
                      minHeight: 500,
                    }}
                  >
                    {column.items.map((item, i) => (
                      <Draggable
                        draggableId={item.id}
                        key={item.id}
                        index={i}
                      >
                        {(provided, snapshot) => (
                          <div

                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              userSelect: "none",
                              padding: 16,
                              margin: "0 0 8px 0",
                              minHeight: "50px",
                              borderRadius: "10px",
                              backgroundColor: snapshot.isDragging
                                ? "#263B4A"
                                : "#456C86",
                              color: "white",
                              ...provided.draggableProps.style
                            }}
                            ref={provided.innerRef}>

                            {item.content}

                          </div>)}

                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))
          }
        </DragDropContext>
      </Container >
    </div>
  );
}
export default App;