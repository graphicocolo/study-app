type FruitRowProps = {
  fruit: string;
}

export default function Study01JsxFruitRow({ fruit }: FruitRowProps) {
  return (
    <>
      <li>
        {/* input uncontrolled（value ではなく defaultValue で初期値だけ渡し、onChange で state
     管理しない） */}
     {/* こうすると入力内容は state ではなく DOM 自身が持つ */}
     {/* keyが変わるとinput自体が作り直されて中身が消える／keyが同じなら中身が保持される */}
        {fruit}: <input defaultValue={fruit} />
      </li>
    </>
  );
}