import { create } from "zustand/react";

type CommandTriggeredModal = "url-input" | "device-select";

type CommandTriggeredModalStore = {
	commandModal: {
		[index in CommandTriggeredModal]: {
			open: boolean;
		};
	};
	setCommandModal(modal: CommandTriggeredModal, open: boolean): void;
};

export const useCommandTriggeredModal = create<CommandTriggeredModalStore>(
	(set, get) => ({
		commandModal: {
			"url-input": { open: false },
			"device-select": { open: false },
		},
		setCommandModal(modal, open) {
			set({
				...get(),
				commandModal: {
					...get().commandModal,
					[modal]: { open },
				},
			});
		},
	}),
);
