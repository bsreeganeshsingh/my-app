import React from 'react';
import Counter from './Counter';

export default {
    title: 'components/counter/Counter',
    component: Counter,
    args: {
        initialValue: 10,
    },
};

export const Default = (args) => <Counter {...args} />;
export const Zero = () => <Counter initialValue={0} />;
export const Hundred = () => <Counter initialValue={100} />;
