import { useRef } from 'react'
import { RackSetCard } from './RackSetCard'
import { SaveSetModal, type SaveSetModalRef } from './SaveSetModal'

/**
 * Права панель для роботи з комплектом стелажів
 */
export function SetPanel() {
  const modalRef = useRef<SaveSetModalRef>(null)

  const handleOpenModal = () => {
    modalRef.current?.open()
  }

  return (
    <>
      <RackSetCard onSave={handleOpenModal} />
      <SaveSetModal ref={modalRef} />
    </>
  )
}
