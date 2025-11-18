import * as Dialog from '@radix-ui/react-dialog';
import { ReactNode } from "react";
import { BeatLoader } from "react-spinners";
import { useLoadingStore } from '../store';

interface Props {
    isOpen: boolean;
    title: string;
    width?: string;
    buttonClass: string;
    cancelBtnName?: string;
    submitBtnName?: string;
    onCancel: () => void;
    onSubmit: () => void;
    readonly children: ReactNode;
}

const ModalLayout = ({ isOpen, title, buttonClass, width = "450px", cancelBtnName = "Cancel", submitBtnName = "Submit", onCancel, onSubmit, children }: Props ) => {
  const { processing } = useLoadingStore((state) => (state));

    return (
      <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onCancel()}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-none z-50" />
            <Dialog.Content className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-xl" 
              style={{ width }} onInteractOutside={(e) => e.preventDefault()}>
            <div>
                <div className="space-y-6">
                    <div className="w-full flex items-center justify-between mb-4">
                      <Dialog.Title className="font-semibold text-xl text-center w-full">{title}</Dialog.Title>
                    </div>
                    {children}
                    <div className="w-full flex justify-center gap-2">
                        <button type="button" disabled={processing} className="close-button w-1/2" onClick={onCancel}> {cancelBtnName} </button>
                        <button type="button" disabled={processing} className={`${buttonClass} w-1/2`} onClick={onSubmit}> 
                            { processing
                                ? <BeatLoader color="white" size={5} className="ml-3" />
                                : <> {submitBtnName} </>
                            }
                        </button>
                    </div>
                </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    )
}

export default ModalLayout;