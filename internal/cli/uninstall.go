package cli

import (
	"fmt"

	"github.com/firemanxbr/cnpg-console/internal/helm"
	"github.com/spf13/cobra"
)

func NewUninstallCmd() *cobra.Command {
	var namespace string
	cmd := &cobra.Command{
		Use:   "uninstall",
		Short: "Uninstall CNPG Console from the cluster",
		RunE: func(cmd *cobra.Command, args []string) error {
			fmt.Println("Uninstalling CNPG Console...")
			if err := helm.Uninstall(namespace); err != nil {
				return fmt.Errorf("uninstall failed: %w", err)
			}
			fmt.Println("CNPG Console uninstalled successfully.")
			return nil
		},
	}
	cmd.Flags().StringVarP(&namespace, "namespace", "n", "cnpg-console", "Target namespace")
	return cmd
}
