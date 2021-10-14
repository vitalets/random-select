# random-select
Select random items from list without repeats.

## Usage
```ts
import { RandomSelect } from 'random-select';

const rs = new RandomSelect();

function selectItem() {
  return rs.select([ 1, 2, 3 ]);
}

const item1 = selectItem(); // any value from array
const item2 = selectItem(); // any value from array, except item1
const item3 = selectItem(); // any value from array, except item1 and item2
const item4 = selectItem(); // any value from array, except item3 (new round)
```

## License
MIT @ [Vitaliy Potapov](https://github.com/vitalets)



