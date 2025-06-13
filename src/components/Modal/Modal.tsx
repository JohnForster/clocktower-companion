import type { ComponentChildren } from "preact";
import { useRef, useEffect } from "preact/hooks";
import "./Modal.css";
import { XMark } from "../../icons/X-Mark";

type ModalProps = {
  title: string;
  isOpen: boolean;
  close: () => void;
  children: ComponentChildren;
};

export function Modal(props: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (props.isOpen) {
      ref.current?.showModal();
    } else {
      ref.current?.close();
    }
  }, [ref.current, props.isOpen]);

  return (
    <dialog ref={ref} onCancel={props.close}>
      <div class="dialog-header">
        <h2>{props.title}</h2>
        <div class="closeButton" role="button" onClick={props.close}>
          <XMark />
        </div>
      </div>
      <div className="dialog-content">{props.children}</div>
    </dialog>
  );
}
