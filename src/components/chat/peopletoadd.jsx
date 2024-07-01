import React from "react";
import {observer} from 'mobx-react'
import EachPerson from './eachperson'


const PeopleToAdd = observer(({ selectedIndices, onSelectionChange, people }) => {

    return (
        <>
            {people.map((person) => (
                <EachPerson
                    key={person.nickname}
                    person={person}
                    isSelected={selectedIndices.includes(person.nickname)}
                    onSelectionChange={onSelectionChange}
                />
            ))}
        </>
    );
});

export default PeopleToAdd;