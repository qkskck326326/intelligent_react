import React, {useEffect, useState} from "react";
import {observer} from 'mobx-react'
import EachPerson from './eachperson'

const PeopleToAdd = observer(({ selectedIndices, onSelectionChange }) => {

    const peopleArray = Array.from({ length: 20 }, (_, index) => index);

    return (
        <>
            {peopleArray.map((index) => (
                <EachPerson
                    key={index}
                    index={index}
                    isSelected={selectedIndices.includes(index)}
                    onSelectionChange={onSelectionChange}
                />
            ))}
            <div>Clicked Count: {selectedIndices.length}</div>
        </>
    );
});

export default PeopleToAdd;