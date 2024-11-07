const enableStacktracePrinting = true;
const inputDataReplacements = [
    ["msg", "test", "\n\n\n\n\n\n\n"],
    ['ex', '{"cmt":""}', '{"cmt":"hello world"}'],
    ['extra', 
        '{"emojis":{"total_item":3,"total_len":18,"items":[{"id":"1400124_013","len":6,"at":[1,2,3]}]}}',
        '{"emojis":{"total_item":3,"total_len":18,"items":[{"id":"1400124.gift.jpg","len":6,"at":[1,2,3]}]}}'
    ],
]

const receiveDataReplacements = [
];