// Import necessary libraries and interfaces
import { createAction, createReducer, PayloadAction } from "@reduxjs/toolkit";
import { Package } from "app/interfaces/packages";

// Define the type for the payload of the 'setPackages' action
type SetPackagesPayload = Package[];

// Define the 'setPackages' action creator with the appropriate payload type
export const setPackages = createAction<SetPackagesPayload>("SET_PACKAGES");

// Define the type for the payload of the 'deletePackage' action
type DeletePackagePayload = number; // Assuming 'number' is the type of the package ID

// Define the 'deletePackage' action creator with the appropriate payload type
export const deletePackage =
  createAction<DeletePackagePayload>("DELETE_PACKAGE");

// Interface to define the shape of the state
interface PackageStatusArrays {
  entregado: Package[];
  pendiente: Package[];
  "en curso": Package[];
}

// Initial state
const initialState: PackageStatusArrays = {
  entregado: [],
  pendiente: [],
  "en curso": []
};

// Create the reducer
const packagesReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(
      setPackages,
      (state, action: PayloadAction<SetPackagesPayload>) => {
        // Clear previous arrays
        state.entregado = [];
        state.pendiente = [];
        state["en curso"] = [];

        // Populate the arrays based on the status of each package
        action.payload.forEach((packageItem) => {
          switch (packageItem.status) {
            case "entregado":
              state.entregado.push(packageItem);
              break;
            case "pendiente":
              state.pendiente.push(packageItem);
              break;
            case "en curso":
              state["en curso"].push(packageItem);
              break;
            default:
              break;
          }
        });
      }
    )
    .addCase(
      deletePackage,
      (state, action: PayloadAction<DeletePackagePayload>) => {
        // Remove the package with the given ID from the appropriate status array
        const packageIdToDelete = action.payload;
        state.entregado = state.entregado.filter(
          (packageItem) => packageItem.id !== packageIdToDelete
        );
        state.pendiente = state.pendiente.filter(
          (packageItem) => packageItem.id !== packageIdToDelete
        );
        state["en curso"] = state["en curso"].filter(
          (packageItem) => packageItem.id !== packageIdToDelete
        );
      }
    );
});

export default packagesReducer;
