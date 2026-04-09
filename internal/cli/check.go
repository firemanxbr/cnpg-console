package cli

import (
	"fmt"

	"github.com/firemanxbr/cnpg-console/internal/checks"
	"github.com/spf13/cobra"
)

func NewCheckCmd() *cobra.Command {
	return &cobra.Command{
		Use:   "check",
		Short: "Run preflight checks against the current Kubernetes cluster",
		RunE: func(cmd *cobra.Command, args []string) error {
			fmt.Println("Running preflight checks...")
			if err := checks.RunAll(); err != nil {
				return fmt.Errorf("preflight checks failed: %w", err)
			}
			fmt.Println()
			fmt.Println("All checks passed. Your cluster is ready for CNPG Console.")
			return nil
		},
	}
}
