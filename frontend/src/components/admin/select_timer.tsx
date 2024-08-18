import React from "react";
import { NumberInput } from '@mantine/core';

const SelectTimer = () => {
    return (
        <NumberInput
            pt={3}
            ml={5}
            w={70}
            placeholder="ⴵ"
            step={30}
            min={0}
        />
    );
};

export default SelectTimer;
