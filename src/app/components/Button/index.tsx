import { ReactNode, ButtonHTMLAttributes } from 'react'

type ButtonProps = {
  children: ReactNode
} & ButtonHTMLAttributes<HTMLButtonElement>

export function Button(props: ButtonProps) {
  return <button type="button" {...props} className="flex pt-0" />
}

// export const Container = styled.button`
//   height: 42px;
//   padding: 0 24px;

//   display: flex;
//   align-items: center;
//   justify-content: center;

//   background: #8257e6;
//   border-radius: 8px;
//   border: 0;

//   color: #fff;
//   font-size: 16px;
//   font-weight: bold;

//   cursor: pointer;

//   &:hover {
//     filter: brightness(0.9);
//   }

//   &:active {
//     filter: brightness(0.7);
//   }
// `
