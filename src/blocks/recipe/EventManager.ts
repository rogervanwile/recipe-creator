export class EventManager {
  private events: { [key: string]: ((data: any) => void)[] } = {};

  // Methode zum Hinzufügen eines Event-Listeners
  on(event: string, listener: (data: any) => void) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
  }

  // Methode zum Entfernen eines Event-Listeners
  off(event: string, listener: (data: any) => void) {
    if (!this.events[event]) return;

    this.events[event] = this.events[event].filter((l) => l !== listener);
  }

  // Methode zum Überschreiben eines Event-Listeners
  overwrite(event: string, listener: (data: any) => void) {
    this.events[event] = [listener];
  }

  // Methode zum Auslösen eines Events
  emit(event: string, data: any) {
    if (!this.events[event]) return;
    this.events[event].forEach((listener) => listener(data));
  }
}
