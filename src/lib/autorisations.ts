import type { Permission, Role } from "@/types/securite";

/**
 * Vérifie une permission déjà résolue côté serveur.
 * La liste des permissions doit provenir d'une session authentifiée
 * et d'une source de confiance, jamais d'une valeur envoyée par le navigateur.
 */
export function possedePermission(
  permissions: readonly Permission[],
  permission: Permission
): boolean {
  return permissions.includes(permission);
}

export function estRoleConnu(valeur: string): valeur is Role {
  return ["admin", "gestionnaire", "comptable", "direction"].includes(valeur);
}

export function libelleRole(role: Role): string {
  const libelles: Record<Role, string> = {
    admin: "Administrateur",
    gestionnaire: "Gestionnaire immobilier",
    comptable: "Comptable / Finance",
    direction: "Direction"
  };

  return libelles[role];
}
