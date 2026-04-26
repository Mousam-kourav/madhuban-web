import { RoomNewForm } from "../room-new-form";

export default function NewRoomPage() {
  return (
    <div className="max-w-lg">
      <h1 className="font-display italic text-4xl text-[var(--color-charcoal)] mb-2">
        New Room
      </h1>
      <p className="font-body text-sm text-[var(--color-muted)] mb-8">
        Enter a name to create the room, then fill in all details on the edit page.
      </p>
      <RoomNewForm />
    </div>
  );
}
