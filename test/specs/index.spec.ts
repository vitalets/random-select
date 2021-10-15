describe('select', () => {

  function assertItem<T>(item: T, items: T[], excludedItems: T[]) {
    const filteredItems = items.filter(item => !excludedItems.includes(item));
    assert.include(filteredItems, item, `${items} excluding ${excludedItems}`);
  }

  it('select items without repeat', async () => {
    const rs = new RandomSelect();
    const items = [ 1, 2, 3 ];
    const select = () => rs.select(items);

    const item1 = select();
    const item2 = select();
    const item3 = select();
    const item4 = select();
    const item5 = select();

    assertItem(item1, items, []);
    assertItem(item2, items, [ item1 ]);
    assertItem(item3, items, [ item1, item2 ]);
    assertItem(item4, items, [ item3 ]);
    assertItem(item5, items, [ item3, item4 ]);
  });

  it('select most different values', async () => {
    const rs = new RandomSelect();
    const values = [
      'привет как дела',
      'привет! как жизнь?',
      'добрый, день',
      'доброе утро',
    ];
    const select = () => rs.select(values);
    for (let i = 0; i <= 10; i++) {
      const calls = [
        select(),
        select(),
      ].map(w => w.substr(0, 4)).sort();
      assert.deepEqual(calls, [
        'добр',
        'прив',
      ]);
    }
  });

  it('save state', async () => {
    const rs = new RandomSelect();
    const items = [ 1, 2, 3 ];
    const item = rs.select(items);
    assert.deepEqual(rs.state, { '1|2|3': [ items.indexOf(item) ] });
  });

  it('use state', async () => {
    const rs = new RandomSelect({ '0|1|2|3|4': [ 0, 1, 2, 3 ] });
    const items = [ 0, 1, 2, 3, 4 ];
    const item = rs.select(items);
    assert.equal(item, 4);
  });

  it('rotate state', async () => {
    const rs = new RandomSelect({ '0|1|2|3|4': [ 0, 1, 2, 3, 4 ] });
    const items = [ 0, 1, 2, 3, 4 ];
    const item = rs.select(items);
    assert.notEqual(item, 4);
    assert.deepEqual(rs.state, { '0|1|2|3|4': [ 4, items.indexOf(item) ] });
  });

  it('custom key', async () => {
    const rs = new RandomSelect();
    const items = [ 1, 2, 3 ];
    const item = rs.select(items, { key: 'foo' });
    assert.deepEqual(rs.state, { 'foo': [ items.indexOf(item) ] });
  });
});

